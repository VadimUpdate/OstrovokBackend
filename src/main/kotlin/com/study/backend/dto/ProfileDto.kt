package com.study.backend.dto

import java.time.LocalDateTime

data class ProfileDto(
    val id: Long,
    val userId: Long,
    val firstName: String?,
    val lastName: String?,
    val phone: String?,
    val address: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)