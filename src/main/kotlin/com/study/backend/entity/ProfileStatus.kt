package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "profile_status")
data class ProfileStatus(
    @Id
    val id: Long = 0,
    val name: String
)
