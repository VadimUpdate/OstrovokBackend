package com.study.backend.dto

import java.time.LocalDateTime

data class ProfileCreateRequest(
    val userId: Long,
    val firstName: String?,
    val lastName: String?,
    val middleName: String?,
    val phone: String?,
    val interests: String?,
    val tgId: String?,
    val status: String?,
    val rating: Double?,
    val address: String?
)

data class ProfileUpdateRequest(
    val firstName: String?,
    val lastName: String?,
    val middleName: String?,
    val phone: String?,
    val interests: String?,
    val tgId: String?,
    val status: String?,
    val rating: Double?,
    val address: String?
)
