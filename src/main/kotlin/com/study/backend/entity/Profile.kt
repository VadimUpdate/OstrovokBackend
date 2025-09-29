package com.study.backend.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "profiles")
data class Profile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.EAGER) // ⚠️ EAGER чтобы user был всегда загружен
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(name = "first_name")
    var firstName: String? = null,

    @Column(name = "last_name")
    var lastName: String? = null,

    var phone: String? = null,

    var address: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
) {
    fun updateTimestamps() {
        updatedAt = LocalDateTime.now()
    }
}
