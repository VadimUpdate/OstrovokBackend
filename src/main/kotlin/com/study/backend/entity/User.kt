package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")

data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val username: String,

    val password: String,

    // например, роли храним строкой с разделителем, можно и коллекцию, но проще пока так
    val role: String = "ROLE_USER"  // значение по умолчанию
)
