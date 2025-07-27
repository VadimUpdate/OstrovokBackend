package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "setting_sbp")
data class SettingSbp(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val name: String,
    var value: String
)

