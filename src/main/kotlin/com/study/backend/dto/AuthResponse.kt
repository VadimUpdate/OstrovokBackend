package com.study.backend.dto

data class AuthResponse(
    val token: String,
    val role: String
)

