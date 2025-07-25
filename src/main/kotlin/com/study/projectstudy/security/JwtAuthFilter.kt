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

@Component
class JwtAuthFilter(
    private val jwtUtil: JwtUtil,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

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
        println("Authorization Header: $authHeader")  // Логируем заголовок

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            println("Extracted Token: $token")  // Логируем извлеченный токен

            try {
                val username = jwtUtil.getUsernameFromToken(token)
                println("Username from token: $username")  // Логируем имя пользователя из токена

                if (username != null && SecurityContextHolder.getContext().authentication == null) {
                    val userDetails = userDetailsService.loadUserByUsername(username)

                    // Исправленная проверка ролей без двойного префикса
                    val authorities = userDetails.authorities
                    println("User Authorities: $authorities")  // Логируем роли пользователя

                    // Проверяем наличие ролей с учетом "ROLE_" и без "ROLE_ROLE_"
                    val validRoles = listOf("ADMIN", "USER")
                    val role = authorities.find { authority ->
                        validRoles.any { role -> authority.authority.contains(role) }
                    }

                    if (role != null && jwtUtil.validateToken(token)) {
                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities
                        )
                        SecurityContextHolder.getContext().authentication = authToken
                    } else {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid token or role")
                        return
                    }
                }
            } catch (ex: Exception) {
                println("Token processing error: ${ex.message}")
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Token processing error")
                return
            }
        }
        filterChain.doFilter(request, response)
    }
}
