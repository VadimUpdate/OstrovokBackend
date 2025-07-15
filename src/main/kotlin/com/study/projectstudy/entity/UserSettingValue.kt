package com.study.projectstudy.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_setting_value")
data class UserSettingValue(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id")
    val setting: Setting,

    var value: String
)
