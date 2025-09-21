import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react-native';
import { UserAvatar } from '@/components';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    reviewCount: number;
  };
  rating: number;
  date: string;
  text: string;
  images?: string[];
  helpful: number;
  replies: number;
  isHelpful?: boolean;
}

interface ReviewCardProps {
  review: Review;
  onHelpfulPress?: (reviewId: string) => void;
  onReplyPress?: (reviewId: string) => void;
  onUserPress?: (userId: string) => void;
}

export default function ReviewCard({
  review,
  onHelpfulPress,
  onReplyPress,
  onUserPress
}: ReviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onUserPress?.(review.id)}
        >
          <UserAvatar 
            imageUri={review.user.avatar}
            initials={review.user.name.split(' ').map(n => n[0]).join('')}
            size={40}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{review.user.name}</Text>
            <Text style={styles.userStats}>{review.user.reviewCount} avaliações</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.date}>{review.date}</Text>
      </View>

      <View style={styles.rating}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={16} 
              color="#FFA500" 
              fill={star <= review.rating ? "#FFA500" : "transparent"} 
            />
          ))}
        </View>
        <Text style={styles.ratingText}>{review.rating}/5</Text>
      </View>

      <Text style={styles.reviewText}>{review.text}</Text>

      {review.images && review.images.length > 0 && (
        <View style={styles.images}>
          {review.images.slice(0, 3).map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
          {review.images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{review.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, review.isHelpful && styles.actionButtonActive]}
          onPress={() => onHelpfulPress?.(review.id)}
        >
          <ThumbsUp 
            size={16} 
            color={review.isHelpful ? "#FF6B35" : "#6B7280"} 
            fill={review.isHelpful ? "#FF6B35" : "transparent"}
          />
          <Text style={[
            styles.actionText,
            review.isHelpful && styles.actionTextActive
          ]}>
            Útil ({review.helpful})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onReplyPress?.(review.id)}
        >
          <MessageCircle size={16} color="#6B7280" />
          <Text style={styles.actionText}>
            Responder ({review.replies})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  userStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  reviewText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  images: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  moreImages: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  actionButtonActive: {
    backgroundColor: '#FFF7F5',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  actionTextActive: {
    color: '#FF6B35',
  },
});