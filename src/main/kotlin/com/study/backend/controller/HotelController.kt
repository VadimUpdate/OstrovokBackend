package com.study.backend.controller

import com.study.backend.dto.HotelRequest
import com.study.backend.entity.Hotel
import com.study.backend.repository.InspectionReasonRepository
import com.study.backend.service.HotelService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/hotels")
class HotelController(
    private val hotelService: HotelService,
    private val inspectionReasonRepository: InspectionReasonRepository
) {

    @GetMapping
    fun getAll(): List<Hotel> = hotelService.getAllHotels()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): Hotel = hotelService.getHotelById(id)

    @PostMapping
    fun create(@RequestBody request: HotelRequest): Hotel {
        val inspectionReason = request.inspectionReasonId?.let {
            inspectionReasonRepository.findById(it)
                .orElseThrow { RuntimeException("InspectionReason not found with id $it") }
        }

        val hotel = Hotel(
            name = request.name,
            description = request.description,
            action = request.action,
            address = request.address,
            city = request.city,
            officialRating = request.officialRating,
            neesInspection = request.neesInspection,
            inspectionReason = inspectionReason,
            lastInspection = request.lastInspection,
            secretGreetAvgTail = request.secretGreetAvgTail
        )
        return hotelService.createHotel(hotel)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody request: HotelRequest): Hotel {
        val inspectionReason = request.inspectionReasonId?.let {
            inspectionReasonRepository.findById(it)
                .orElseThrow { RuntimeException("InspectionReason not found with id $it") }
        }

        val hotel = Hotel(
            id = id,
            name = request.name,
            description = request.description,
            action = request.action,
            address = request.address,
            city = request.city,
            officialRating = request.officialRating,
            neesInspection = request.neesInspection,
            inspectionReason = inspectionReason,
            lastInspection = request.lastInspection,
            secretGreetAvgTail = request.secretGreetAvgTail
        )
        return hotelService.updateHotel(id, hotel)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID) = hotelService.deleteHotel(id)
}
