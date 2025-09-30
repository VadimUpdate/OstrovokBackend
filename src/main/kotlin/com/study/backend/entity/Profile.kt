package com.study.backend.entity

import com.study.backend.entity.User
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "profiles")
data class Profile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(name = "first_name")
    var firstName: String? = null,

    @Column(name = "last_name")
    var lastName: String? = null,

    @Column(name = "middle_name")
    var middleName: String? = null,

    @Column(name = "phone")
    var phone: String? = null,

    @Column(name = "interests")
    var interests: String? = null,

    @Column(name = "tg_id")
    var tgId: String? = null,

    @Column(name = "status")
    var status: String? = null,

    @Column(name = "rating")
    var rating: Double? = null,

    @Column(name = "address")
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
