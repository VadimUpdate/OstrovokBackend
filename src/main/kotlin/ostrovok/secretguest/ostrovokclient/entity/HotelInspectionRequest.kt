package ostrovok.secretguest.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "hotel_inspection_requests")
data class HotelInspectionRequest(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    val hotel: Hotel,

    @Column(name = "start_date")
    val startDate: LocalDateTime,

    @Column(name = "status")
    val status: String,

    @Column(name = "creator")
    val creator: String, // APRIL/System

    @Column(name = "description")
    val description: String? = null,

    @Column(name = "session_count")
    val sessionCount: Int, // secret-guest count
)