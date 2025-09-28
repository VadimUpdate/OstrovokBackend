package com.study.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "hotels")
data class Hotel(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val name: String,

    val description: String? = null,
    val action: String? = null,
    val address: String? = null,
    val city: String? = null,
    @Column(name = "official_rating")
    val officialRating: Int? = null,
    @Column(name = "nees_inspection")
    val neesInspection: Boolean = false,

    @ManyToOne
    @JoinColumn(name = "inspection_reason_id")
    val inspectionReason: InspectionReason? = null,

    @Column(name = "last_inspection")
    val lastInspection: LocalDateTime? = null,

    @Column(name = "secret_greet_avg_tail")
    val secretGreetAvgTail: Double? = null
)
