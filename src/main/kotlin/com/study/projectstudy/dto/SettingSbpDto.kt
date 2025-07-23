package com.study.projectstudy.dto

import com.study.projectstudy.entity.SettingSbp

data class SettingSbpDto(
    val id: Long,
    val name: String,
    val value: String
) {
    companion object {
        fun fromEntity(entity: SettingSbp) = SettingSbpDto(
            id = entity.id,
            name = entity.name,
            value = entity.value
        )
    }
}

