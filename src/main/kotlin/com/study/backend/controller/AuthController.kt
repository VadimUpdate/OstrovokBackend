package com.study.backend.controller

import com.study.backend.dto.AuthRequest
import com.study.backend.service.AuthService
import com.study.backend.security.JwtUtil
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = ["http://localhost:3000"])
class AuthController(
    private val authService: AuthService,
    private val jwtUtil: JwtUtil
) {

    // Старый register оставляем без изменений
    @PostMapping("/register")
    fun register(@RequestBody request: AuthRequest): ResponseEntity<String> {
        return if (authService.register(request.username, request.password)) {
            ResponseEntity.ok("User registered")
        } else {
            ResponseEntity.badRequest().body("User already exists")
        }
    }

    // Старая точка /login оставляем (чтобы не ломать другие клиенты)
    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): ResponseEntity<Map<String, String>> {
        val authenticated = authService.authenticate(request.username, request.password)
        return if (authenticated) {
            val user = authService.getUserByUsername(request.username)
            val role = user?.role ?: "ROLE_USER"

            val token = jwtUtil.generateToken(request.username, role)
            // Возвращаем token в привычном виде (key "token"), но также можно вернуть access/refresh
            ResponseEntity.ok(mapOf("token" to token, "role" to role))
        } else {
            ResponseEntity.status(401).body(mapOf("detail" to "Invalid credentials"))
        }
    }

    // --- Эндпоинты под фронт: /api/auth/token/... ---

    // POST /api/auth/token/  -> логин, возвращает access и refresh (т.к. у тебя есть только generateToken,
    // мы безопасно возвращаем одинаковый токен в оба поля, чтобы фронт не падал)
    @PostMapping("/token/")
    fun token(@RequestBody request: AuthRequest): ResponseEntity<Map<String, String>> {
        val authenticated = authService.authenticate(request.username, request.password)
        return if (authenticated) {
            val user = authService.getUserByUsername(request.username)
            val role = user?.role ?: "ROLE_USER"

            val token = jwtUtil.generateToken(request.username, role)
            // Если позже добавишь generateRefreshToken — просто поменяй здесь refresh
            ResponseEntity.ok(mapOf("access" to token, "refresh" to token))
        } else {
            ResponseEntity.status(401).body(mapOf("detail" to "Invalid credentials"))
        }
    }

    // POST /api/auth/token/verify/  -> проверка токена { "token": "..." }
    @PostMapping("/token/verify/")
    fun verify(@RequestBody body: Map<String, String>): ResponseEntity<Map<String, String>> {
        val token = body["token"] ?: return ResponseEntity.badRequest().body(mapOf("detail" to "Token is required"))
        return if (jwtUtil.validateToken(token)) {
            ResponseEntity.ok(mapOf("detail" to "Token is valid"))
        } else {
            ResponseEntity.status(401).body(mapOf("detail" to "Invalid or expired token", "code" to "token_not_valid"))
        }
    }

    // POST /api/auth/token/refresh/ -> обновление access по refresh { "refresh": "..." }
    @PostMapping("/token/refresh/")
    fun refresh(@RequestBody body: Map<String, String>): ResponseEntity<Map<String, String>> {
        val refresh = body["refresh"] ?: return ResponseEntity.badRequest().body(mapOf("detail" to "Refresh token is required"))

        return if (jwtUtil.validateToken(refresh)) {
            val username = jwtUtil.getUsernameFromToken(refresh)
            val role = authService.getUserByUsername(username)?.role ?: "ROLE_USER"
            val newAccess = jwtUtil.generateToken(username, role) // заново генерируем токен
            ResponseEntity.ok(mapOf("access" to newAccess))
        } else {
            ResponseEntity.status(401).body(mapOf("detail" to "Invalid refresh token"))
        }
    }
}
