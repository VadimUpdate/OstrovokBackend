package ostrovok.secretguest.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "inspection_reports")
data class InspectionReport(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne
    @JoinColumn(name = "guest_request_id")
    val guestRequest: GuestRequest,

    // Ratings (1-10 scale)
    @Column(name = "clean_rating")
    val cleanRating: Int?,

    @Column(name = "service_rating")
    val serviceRating: Int?,

    @Column(name = "room_condition_rating")
    val roomConditionRating: Int?,

    @Column(name = "money_rating")
    val moneyRating: Int?, // value for money

    @Column(name = "overall_rating")
    val overallRating: Double?,

    // Comments
    @Column(name = "cleanless_comment", columnDefinition = "TEXT")
    val cleanlessComment: String?, // Cleanless comment

    @Column(name = "service_comment", columnDefinition = "TEXT")
    val serviceComment: String?,

    @Column(name = "room_condition_comment", columnDefinition = "TEXT")
    val roomConditionComment: String?,

    @Column(name = "improvement_comment", columnDefinition = "TEXT")
    val improvementComment: String?, // "import a comment" → improvement comment

    @Column(name = "final_verdict", columnDefinition = "TEXT")
    val finalVerdict: String?,

    // Status
    @Column(name = "status")
    val status: String, // [created, approved] context

    @Column(name = "points_from_admin")
    val pointsFromAdmin: Int? // points from count
)