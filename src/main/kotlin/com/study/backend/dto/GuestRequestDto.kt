package com.study.backend.dto

import java.time.LocalDateTime
import java.util.*

data class GuestRequestDto(
    val id: UUID? = null,
    val guestId: Long,            // Profile.id = Long
    val hotelInspectionId: UUID,  // HotelInspectionRequest.id = UUID
    val dateStart: LocalDateTime,
    val dateFinish: LocalDateTime
)
