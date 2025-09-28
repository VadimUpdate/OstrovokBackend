package com.study.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UserCreateUpdateDto(
    @field:NotBlank(message = "Username is required")
    @field:Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    val username: String,

    val email: String? = null,

    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String? = null,

    val role: String = "ROLE_USER"
)