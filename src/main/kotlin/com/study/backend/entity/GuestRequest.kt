package com.study.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "guest_requests")
data class GuestRequest(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne
    @JoinColumn(name = "guest_id")
    val guest: Profile,

    @ManyToOne
    @JoinColumn(name = "hotel_inspection_id")
    val hotelInspection: HotelInspectionRequest,

    @Column(name = "date_start")
    val dateStart: LocalDateTime,

    @Column(name = "date_finish")
    val dateFinish: LocalDateTime
)