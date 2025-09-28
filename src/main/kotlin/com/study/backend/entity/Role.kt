package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "roles")
data class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <- теперь числовой ID
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val name: String
)
