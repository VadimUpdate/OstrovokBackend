package com.study.backend.entity

import jakarta.persistence.*

@Entity
@Table(name = "cities")
data class City(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    var name: String,

    var region: String? = null,
    var country: String? = null,
    var latitude: Double? = null,
    var longitude: Double? = null
)
