package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "setting")
data class Setting(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val name: String,


    @Column(name = "default_value")
    var defaultValue: String
)
