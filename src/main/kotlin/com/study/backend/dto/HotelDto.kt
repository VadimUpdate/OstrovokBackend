package com.study.backend.dto

import java.time.LocalDateTime
import java.util.*

data class HotelRequest(
    val name: String,
    val description: String? = null,
    val action: String? = null,
    val address: String? = null,
    val city: String? = null,
    val officialRating: Int? = null,
    val neesInspection: Boolean = false,
    val inspectionReasonId: UUID? = null,
    val lastInspection: LocalDateTime? = null,
    val secretGreetAvgTail: Double? = null
)
