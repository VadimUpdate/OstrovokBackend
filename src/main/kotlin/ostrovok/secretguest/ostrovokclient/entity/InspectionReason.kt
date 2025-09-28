package com.ostrovok.secretguest.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "inspection_reasons")
data class InspectionReason(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val name: String
)