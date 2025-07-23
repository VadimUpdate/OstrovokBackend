package com.study.projectstudy.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
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
        println("🛡 JwtAuthFilter: обработка пути $path")

        // Пропускаем публичные маршруты без проверки токена
        if (path.startsWith("/api/auth/register") || path.startsWith("/api/auth/login")) {
            println("➡ Публичный маршрут — пропуск без проверки токена")
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader("Authorization")
        println("🔐 Authorization header: $authHeader")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            println("🔑 JWT token: $token")

            try {
                val username = jwtUtil.getUsernameFromToken(token)
                println("👤 Username из токена: $username")

                if (username != null && SecurityContextHolder.getContext().authentication == null) {
                    val userDetails = userDetailsService.loadUserByUsername(username)
                    println("📦 UserDetails найден: ${userDetails.username}")

                    if (jwtUtil.validateToken(token)) {
                        println("✅ Токен валиден. Устанавливаем аутентификацию.")
                        val authToken = UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.authorities
                        )
                        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authToken
                    } else {
                        println("⛔ Токен недействителен")
                    }
                }
            } catch (ex: Exception) {
                println("❌ Ошибка при обработке токена: ${ex.message}")
            }
        } else {
            println("⚠ Заголовок Authorization отсутствует или неверный")
        }

        filterChain.doFilter(request, response)
    }
}