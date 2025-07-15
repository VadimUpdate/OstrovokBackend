package com.study.projectstudy.controller

import com.study.projectstudy.dto.AuthRequest
import com.study.projectstudy.dto.AuthResponse
import com.study.projectstudy.service.AuthService
import com.study.projectstudy.security.JwtUtil
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
        return if (authService.authenticate(request.username, request.password)) {
            val token = jwtUtil.generateToken(request.username)
            ResponseEntity.ok(AuthResponse(token))
        } else {
            ResponseEntity.status(401).build()
        }
    }
}
