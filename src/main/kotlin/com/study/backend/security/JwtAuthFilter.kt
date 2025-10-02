package com.study.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import org.slf4j.LoggerFactory

@Component
class JwtAuthFilter(
    private val jwtUtil: JwtUtil,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    private val logger = LoggerFactory.getLogger(JwtAuthFilter::class.java)

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val path = request.servletPath
        logger.debug("JwtAuthFilter: request path = $path")

        // ==== SKIP public endpoints ====
        val skip = listOf("/api/auth", "/api/auth/", "/health", "/health/")

        if (skip.any { path.startsWith(it) }) {
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader("Authorization")
        logger.debug("JwtAuthFilter: Authorization header present = ${authHeader != null}")

        if (authHeader.isNullOrBlank() || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substringAfter("Bearer ").trim()
        try {
            val username = jwtUtil.getUsernameFromToken(token)
            logger.debug("JwtAuthFilter: token sub = $username")

            val userDetails = try {
                userDetailsService.loadUserByUsername(username)
            } catch (ex: Exception) {
                logger.warn("JwtAuthFilter: user not found for sub='$username': ${ex.message}")
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: user not found")
                return
            }

            if (!jwtUtil.validateToken(token)) {
                logger.warn("JwtAuthFilter: token validation failed for sub=$username")
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: invalid token")
                return
            }

            val authToken = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
            SecurityContextHolder.getContext().authentication = authToken
            logger.info("JwtAuthFilter: Authentication set for user '$username' with authorities=${userDetails.authorities}")

        } catch (ex: Exception) {
            logger.error("JwtAuthFilter: token processing error: ${ex.message}", ex)
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Token processing error")
            return
        }

        filterChain.doFilter(request, response)
    }
}
