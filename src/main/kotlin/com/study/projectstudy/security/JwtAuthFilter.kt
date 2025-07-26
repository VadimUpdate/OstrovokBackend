package com.study.projectstudy.security

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

                    // Логирование роли пользователя
                    logger.info("User details loaded for username: $username")

                    // Проверяем, есть ли роль "ADMIN" или другие необходимые роли
                    val authorities = userDetails.authorities
                    val normalizedAuthorities = authorities.map { it.authority.replace("ROLE_", "") }
                    logger.info("User roles: $normalizedAuthorities")

                    if (jwtUtil.validateToken(token)) {
                        if (normalizedAuthorities.contains("ADMIN")) {
                            val authToken = UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities
                            )
                            SecurityContextHolder.getContext().authentication = authToken
                            logger.info("Authentication set for user: $username with roles: $normalizedAuthorities")
                        } else {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Insufficient permissions")
                            logger.warn("User '$username' has insufficient permissions")
                            return
                        }
                    } else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid token")
                        logger.error("Invalid token for user '$username'")
                        return
                    }
                }
            } catch (ex: Exception) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Token processing error")
                logger.error("Error processing token for request: ${ex.message}", ex)
                return
            }
        } else {
            logger.warn("Authorization header missing or malformed")
        }

        filterChain.doFilter(request, response)
    }
}
