package com.study.backend.service

import com.study.backend.dto.HotelRequest
import com.study.backend.entity.Hotel
import com.study.backend.repository.CityRepository
import com.study.backend.repository.HotelRepository
import com.study.backend.repository.InspectionReasonRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class HotelService(
    private val hotelRepo: HotelRepository,
    private val cityRepo: CityRepository,
    private val reasonRepo: InspectionReasonRepository
) {

    fun getAll(): List<Hotel> = hotelRepo.findAll()

    fun getById(id: UUID): Hotel =
        hotelRepo.findById(id).orElseThrow { RuntimeException("Hotel not found: $id") }

    @Transactional
    fun create(req: HotelRequest): Hotel {
        val city = req.cityId?.let { id ->
            cityRepo.findById(id).orElseThrow { RuntimeException("City not found: $id") }
        }

        val reason = req.inspectionReasonId?.let { id ->
            reasonRepo.findById(id).orElseThrow { RuntimeException("InspectionReason not found: $id") }
        }

        val hotel = Hotel(
            name = req.name,
            description = req.description,
            action = req.action,
            address = req.address,
            city = city,
            officialRating = req.officialRating,
            neesInspection = req.neesInspection,
            inspectionReason = reason,
            lastInspection = req.lastInspection,
            secretGreetAvgTail = req.secretGreetAvgTail
        )

        return hotelRepo.save(hotel)
    }

    @Transactional
    fun update(id: UUID, req: HotelRequest): Hotel {
        val exist = getById(id)

        val city = req.cityId?.let { cid ->
            cityRepo.findById(cid).orElseThrow { RuntimeException("City not found: $cid") }
        }

        val reason = req.inspectionReasonId?.let { rid ->
            reasonRepo.findById(rid).orElseThrow { RuntimeException("InspectionReason not found: $rid") }
        }

        val updated = exist.copy(
            name = req.name,
            description = req.description,
            action = req.action,
            address = req.address,
            city = city,
            officialRating = req.officialRating,
            neesInspection = req.neesInspection,
            inspectionReason = reason,
            lastInspection = req.lastInspection,
            secretGreetAvgTail = req.secretGreetAvgTail
        )

        return hotelRepo.save(updated)
    }

    @Transactional
    fun delete(id: UUID) {
        val exist = getById(id)
        hotelRepo.delete(exist)
    }
}
