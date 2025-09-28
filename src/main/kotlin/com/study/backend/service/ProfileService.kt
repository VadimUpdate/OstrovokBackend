package com.study.backend.service

import com.study.backend.entity.Profile
import com.study.backend.repository.ProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProfileService(private val profileRepository: ProfileRepository) {

    fun getAllProfiles(): List<Profile> = profileRepository.findAll()

    fun getProfileById(id: Long): Profile =
        profileRepository.findById(id).orElseThrow { RuntimeException("Profile not found with id: $id") }

    fun getProfileByUserId(userId: Long): Profile =
        profileRepository.findByUserId(userId) ?: throw RuntimeException("Profile not found for user id: $userId")

    @Transactional
    fun createProfile(profile: Profile): Profile = profileRepository.save(profile)

    @Transactional
    fun updateProfile(id: Long, updatedProfile: Profile): Profile {
        val existing = getProfileById(id)
        existing.firstName = updatedProfile.firstName
        existing.lastName = updatedProfile.lastName
        existing.phone = updatedProfile.phone
        existing.address = updatedProfile.address
        existing.updatedAt = LocalDateTime.now()
        return profileRepository.save(existing)
    }

    @Transactional
    fun deleteProfile(id: Long) {
        val existing = getProfileById(id)
        profileRepository.delete(existing)
    }
}
