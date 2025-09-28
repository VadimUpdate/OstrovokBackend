package com.study.backend.dto

import java.time.LocalDateTime

data class ProfileCreateRequest(
    val userId: Long,
    val firstName: String?,
    val lastName: String?,
    val phone: String?,
    val address: String?
)