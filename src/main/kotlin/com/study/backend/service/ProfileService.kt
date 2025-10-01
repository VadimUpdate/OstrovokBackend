package com.study.backend.service

import com.study.backend.dto.ProfileCreateRequest
import com.study.backend.dto.ProfileUpdateRequest
import com.study.backend.entity.City
import com.study.backend.entity.Profile
import com.study.backend.entity.User
import com.study.backend.repository.CityRepository
import com.study.backend.repository.ProfileRepository
import com.study.backend.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfileService(
    private val profileRepo: ProfileRepository,
    private val userRepo: UserRepository,
    private val cityRepo: CityRepository
) {

    fun getAll(): List<Profile> = profileRepo.findAll()

    fun getById(id: Long): Profile =
        profileRepo.findById(id).orElseThrow { RuntimeException("Profile not found: $id") }

    @Transactional
    fun create(req: ProfileCreateRequest): Profile {
        val user: User = userRepo.findById(req.userId)
            .orElseThrow { RuntimeException("User not found: ${req.userId}") }
        val city: City = cityRepo.findById(req.cityId)
                .orElseThrow { RuntimeException("City not found: ${req.cityId}") };

        val profile = Profile(
            user = user,
            city = city,
            firstName = req.firstName,
            lastName = req.lastName,
            patronymic = req.patronymic,
            phone = req.phone,
            interests = req.interests,
            tgId = req.tgId,
            status = req.status,
            rating = req.rating,
            address = req.address
        )

        return profileRepo.save(profile)
    }

    @Transactional
    fun update(id: Long, req: ProfileUpdateRequest): Profile {
        val existing = getById(id)
        val user: User = userRepo.findById(req.userId)
                .orElseThrow { RuntimeException("User not found: ${req.userId}") }
        val city: City = cityRepo.findById(req.cityId)
                .orElseThrow { RuntimeException("City not found: ${req.cityId}") };

        val updated = existing.copy(
            firstName = req.firstName ?: existing.firstName,
            lastName = req.lastName ?: existing.lastName,
            patronymic = req.middleName ?: existing.patronymic,
            phone = req.phone ?: existing.phone,
            interests = req.interests ?: existing.interests,
            tgId = req.tgId ?: existing.tgId,
            status = req.status ?: existing.status,
            rating = req.rating ?: existing.rating,
            address = req.address ?: existing.address,
            user = user,
            city = city,
        )

        return profileRepo.save(updated)
    }

    @Transactional
    fun delete(id: Long) {
        val existing = getById(id)
        profileRepo.delete(existing)
    }
}
