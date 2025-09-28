package com.study.backend.controller

import com.study.backend.entity.Profile
import com.study.backend.service.ProfileService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import org.springframework.http.HttpStatus

@RestController
@RequestMapping("/api/profiles")
class ProfileController(private val profileService: ProfileService) {

    @GetMapping
    fun getAll(): List<Profile> = profileService.getAllProfiles()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): Profile = profileService.getProfileById(id)

    @PostMapping
    fun create(@RequestBody profile: Profile): Profile = profileService.createProfile(profile)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody profile: Profile): Profile =
        profileService.updateProfile(id, profile)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        profileService.deleteProfile(id)
    }
}
