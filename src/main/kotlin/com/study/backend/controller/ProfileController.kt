package com.study.backend.controller

import com.study.backend.dto.ProfileCreateRequest
import com.study.backend.entity.Profile
import com.study.backend.entity.User
import com.study.backend.repository.UserRepository
import com.study.backend.service.ProfileService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profiles")
class ProfileController(
    private val profileService: ProfileService,
    private val userRepository: UserRepository
) {

    @GetMapping
    fun getAll() = profileService.getAllProfiles()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = profileService.getProfileById(id)

    @PostMapping
    fun create(@RequestBody request: ProfileCreateRequest): Profile {
        val user = userRepository.findById(request.userId)
            .orElseThrow { RuntimeException("User not found with id: ${request.userId}") }
        val profile = Profile(
            user = user,
            firstName = request.firstName,
            lastName = request.lastName,
            phone = request.phone,
            address = request.address
        )
        return profileService.createProfile(profile)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: ProfileCreateRequest): Profile {
        val existingProfile = profileService.getProfileById(id)
        val updatedProfile = existingProfile.copy(
            firstName = request.firstName,
            lastName = request.lastName,
            phone = request.phone,
            address = request.address
        )
        return profileService.updateProfile(id, updatedProfile)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) = profileService.deleteProfile(id)
}
