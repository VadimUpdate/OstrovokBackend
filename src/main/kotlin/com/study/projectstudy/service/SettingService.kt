package com.study.projectstudy.service

import com.study.projectstudy.dto.SettingDto
import com.study.projectstudy.dto.SettingSbpDto
import com.study.projectstudy.repository.SettingRepository
import com.study.projectstudy.repository.SettingSbpRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import com.study.projectstudy.security.JwtUtil

@Service
class SettingService(
    private val settingRepository: SettingRepository,
    private val settingSbpRepository: SettingSbpRepository
) {

    fun getSettings(section: String?): List<Any> {
        val normalized = section?.trim()?.lowercase()
        println(">>> normalized section = '$normalized'")  // Это можно удалить, если не нужно логировать
        return if (normalized == "sbp") {
            getSettingsSbp()
        } else {
            getSettingsNormal()
        }
    }

    private fun getSettingsNormal(): List<SettingDto> =
        settingRepository.findAllByOrderByIdAsc().map {
            SettingDto(it.id, it.name, it.defaultValue)
        }

    private fun getSettingsSbp(): List<SettingSbpDto> =
        settingSbpRepository.findAllByOrderByIdAsc().map { SettingSbpDto.fromEntity(it) }

    @Transactional
    fun updateSetting(settingId: Long, section: String, newValue: String) {
        if (section == "sbp") {
            val setting = settingSbpRepository.findById(settingId)
                .orElseThrow { IllegalArgumentException("SBP setting not found") }
            setting.value = newValue
            settingSbpRepository.save(setting)
        } else {
            val setting = settingRepository.findById(settingId)
                .orElseThrow { IllegalArgumentException("Setting not found") }
            setting.defaultValue = newValue
            settingRepository.save(setting)
        }
    }
}
