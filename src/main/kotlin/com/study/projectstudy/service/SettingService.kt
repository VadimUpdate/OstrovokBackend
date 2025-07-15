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

    private val repoDir = File("C:\\Users\\user\\IdeaProjects\\Admin-consol\\Configs")

    fun pushConfigToGit(configFileName: String, content: String) {
        val configFile = File(repoDir, configFileName)

        configFile.writeText(content)

        val commands = listOf(
            "git -C ${repoDir.absolutePath} add $configFileName",
            "git -C ${repoDir.absolutePath} commit -m \"Update config $configFileName\"",
            "git -C ${repoDir.absolutePath} push"
        )

        for (cmd in commands) {
            val process = Runtime.getRuntime().exec(cmd)
            process.waitFor()
            if (process.exitValue() != 0) {
                val error = process.errorStream.bufferedReader().readText()
                throw RuntimeException("Git command failed: $cmd\nError: $error")
            }
        }
    }

    fun generateYamlForUser(user: User): String {
        val settings = getSettingsForUser(user)
        val map = mutableMapOf<String, Any>()
        for (setting in settings) {
            map[setting.name] = parseValue(setting.value)
        }

        val options = DumperOptions().apply {
            defaultFlowStyle = DumperOptions.FlowStyle.BLOCK
            isPrettyFlow = true
        }
        val yaml = Yaml(options)
        return yaml.dump(map)
    }

    fun printRepoDir() {
        println("Repo directory absolute path: ${repoDir.absolutePath}")
        if (repoDir.exists() && repoDir.isDirectory) {
            println("Repo directory exists and is a directory")
        } else {
            println("Repo directory does NOT exist or is not a directory")
        }
    }

    private fun parseValue(value: String): Any {
        return when {
            value.equals("true", ignoreCase = true) -> true
            value.equals("false", ignoreCase = true) -> false
            value.toIntOrNull() != null -> value.toInt()
            value.toDoubleOrNull() != null -> value.toDouble()
            else -> value
        }
    }

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

        try {
            val yamlContent = generateYamlForUser(user)
            pushConfigToGit("application.yml", yamlContent)
        } catch (ex: Exception) {
            println("Git push failed: ${ex.message}")
        }
    }
}
