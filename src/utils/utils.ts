import { UserSubscription } from 'src/entity/subscription/Subscription';
import { Repository } from 'typeorm';

export const checkSubscriptionEveryItemPost = async (
  userSubscription: Repository<UserSubscription>,
  userId: number,
) => {
  let isCanPost: boolean = true;

  const subscriptionInfo = await userSubscription.findOne({
    select: {
      userId: true,
      maxNoToPost: true,
      userType: true,
      isSubscribed: true,
      subscription_expiry: true,
    },
    where: {
      userId,
    },
  });
  
  if (subscriptionInfo.userType === 'individual-user') {
    if (!subscriptionInfo.isSubscribed) {
      if (subscriptionInfo.maxNoToPost === 0) isCanPost = false;
    }
  } else if (subscriptionInfo.userType === 'company') {
    const d1 = new Date(subscriptionInfo.subscription_expiry);
    const d2 = new Date();
    if (!subscriptionInfo.isSubscribed || d1 < d2) isCanPost = false;
  }

  return isCanPost;
};
