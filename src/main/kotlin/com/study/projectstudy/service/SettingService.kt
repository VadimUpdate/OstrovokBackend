package com.study.projectstudy.service

import java.io.File

import com.study.projectstudy.dto.SettingDto
import com.study.projectstudy.entity.User
import com.study.projectstudy.entity.Setting
import com.study.projectstudy.entity.UserSettingValue
import com.study.projectstudy.repository.SettingRepository
import com.study.projectstudy.repository.UserSettingValueRepository

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import org.yaml.snakeyaml.DumperOptions
import org.yaml.snakeyaml.Yaml

@Service
class SettingService(
    private val settingRepository: SettingRepository,
    private val userSettingValueRepository: UserSettingValueRepository
) {

    fun getSettingsForUser(user: User): List<SettingDto> {
        val globalSettings = settingRepository.findAll()
        val userSettings = userSettingValueRepository.findByUser(user).associateBy { it.setting.id }

        return globalSettings.map { setting ->
            val userValue = userSettings[setting.id]?.value
            SettingDto(
                id = setting.id,
                name = setting.name,
                value = userValue ?: setting.defaultValue
            )
        }
    }

    @Transactional
    fun updateSettingValue(user: User, settingId: Long, newValue: String) {
        val setting = settingRepository.findById(settingId)
            .orElseThrow { IllegalArgumentException("Setting not found") }

        val userSettingValue = userSettingValueRepository.findByUserAndSetting(user, setting)
        if (userSettingValue != null) {
            userSettingValue.value = newValue
            userSettingValueRepository.save(userSettingValue)
        } else {
            val newUserSettingValue = UserSettingValue(
                user = user,
                setting = setting,
                value = newValue
            )
            userSettingValueRepository.save(newUserSettingValue)
        }
    }
}
