package com.study.backend.service

import com.study.backend.entity.Hotel
import com.study.backend.repository.HotelRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class HotelService(private val hotelRepository: HotelRepository) {

    fun getAllHotels(): List<Hotel> = hotelRepository.findAll()

    fun getHotelById(id: UUID): Hotel =
        hotelRepository.findById(id).orElseThrow { RuntimeException("Hotel not found with id: $id") }

    @Transactional
    fun createHotel(hotel: Hotel): Hotel = hotelRepository.save(hotel)

    @Transactional
    fun updateHotel(id: UUID, updatedHotel: Hotel): Hotel {
        val existing = getHotelById(id)
        val hotelToSave = updatedHotel.copy(id = existing.id)
        return hotelRepository.save(hotelToSave)
    }

    @Transactional
    fun deleteHotel(id: UUID) {
        val hotel = getHotelById(id)
        hotelRepository.delete(hotel)
    }
}
