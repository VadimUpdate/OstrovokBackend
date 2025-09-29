// com.study.backend.dto.UserDto
package com.study.backend.dto

import java.time.LocalDateTime

data class UserDto(
    val id: Long,
    val username: String,
    val email: String?,
    val role: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)