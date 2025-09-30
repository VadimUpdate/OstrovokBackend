package com.study.backend.service

import com.study.backend.dto.GuestRequestDto
import com.study.backend.entity.GuestRequest
import com.study.backend.repository.GuestRequestRepository
import com.study.backend.repository.ProfileRepository
import com.study.backend.repository.HotelInspectionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class GuestRequestService(
    private val repo: GuestRequestRepository,
    private val profileRepo: ProfileRepository,
    private val hotelRepo: HotelInspectionRepository
) {

    fun getAll(): List<GuestRequest> = repo.findAll()

    fun getById(id: UUID): GuestRequest =
        repo.findById(id).orElseThrow { RuntimeException("GuestRequest not found: $id") }

    @Transactional
    fun create(dto: GuestRequestDto): GuestRequest {
        val guest = profileRepo.findById(dto.guestId)
            .orElseThrow { RuntimeException("Profile not found: ${dto.guestId}") }
        val hotel = hotelRepo.findById(dto.hotelInspectionId)
            .orElseThrow { RuntimeException("HotelInspection not found: ${dto.hotelInspectionId}") }

        val entity = GuestRequest(
            guest = guest,
            hotelInspection = hotel,
            dateStart = dto.dateStart,
            dateFinish = dto.dateFinish
        )
        return repo.save(entity)
    }

    @Transactional
    fun update(id: UUID, dto: GuestRequestDto): GuestRequest {
        val exist = getById(id)
        val guest = profileRepo.findById(dto.guestId)
            .orElseThrow { RuntimeException("Profile not found: ${dto.guestId}") }
        val hotel = hotelRepo.findById(dto.hotelInspectionId)
            .orElseThrow { RuntimeException("HotelInspection not found: ${dto.hotelInspectionId}") }

        val updated = exist.copy(
            guest = guest,
            hotelInspection = hotel,
            dateStart = dto.dateStart,
            dateFinish = dto.dateFinish
        )
        return repo.save(updated)
    }

    @Transactional
    fun delete(id: UUID) {
        val exist = getById(id)
        repo.delete(exist)
    }
}
