package com.study.backend.controller

import com.study.backend.dto.AuthRequest
import com.study.backend.dto.AuthResponse
import com.study.backend.service.AuthService
import com.study.backend.security.JwtUtil
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/register")
    fun register(@RequestBody request: AuthRequest): ResponseEntity<String> {
        return if (authService.register(request.username, request.password)) {
            ResponseEntity.ok("User registered")
        } else {
            ResponseEntity.badRequest().body("User already exists")
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): ResponseEntity<AuthResponse> {
        val authenticated = authService.authenticate(request.username, request.password)
        return if (authenticated) {
            val user = authService.getUserByUsername(request.username)
            val role = user?.role ?: "ROLE_USER"

            // Передаем username и роль в метод generateToken
            val token = jwtUtil.generateToken(request.username, role)

            ResponseEntity.ok(AuthResponse(token, role))
        } else {
            ResponseEntity.status(401).build()
        }
    }
}
