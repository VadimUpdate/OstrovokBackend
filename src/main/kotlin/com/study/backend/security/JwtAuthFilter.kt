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

        // Пропускаем пути для регистрации и логина
        if (path.startsWith("/api/auth/register") || path.startsWith("/api/auth/login")) {
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader("Authorization")
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)

            try {
                val username = jwtUtil.getUsernameFromToken(token)
                if (username != null && SecurityContextHolder.getContext().authentication == null) {
                    val userDetails = userDetailsService.loadUserByUsername(username)

                    if (jwtUtil.validateToken(token)) {
                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.authorities
                        )
                        SecurityContextHolder.getContext().authentication = authToken
                        logger.info("Authentication set for user: $username with roles: ${userDetails.authorities}")
                    } else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid token")
                        logger.warn("Invalid token for user '$username'")
                        return
                    }
                }
            } catch (ex: Exception) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Token processing error")
                logger.error("Error processing token: ${ex.message}", ex)
                return
            }
        } else {
            logger.warn("Authorization header missing or malformed")
        }

        filterChain.doFilter(request, response)
    }
}
