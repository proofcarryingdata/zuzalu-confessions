# called at build-time on render.com

rm ./.env.local
echo "NEXT_PUBLIC_CONFESSIONS_SERVER_URL='$NEXT_PUBLIC_CONFESSIONS_SERVER_URL'" >> ./.env.local
echo "NEXT_PUBLIC_SEMAPHORE_GROUP_URL='$NEXT_PUBLIC_SEMAPHORE_GROUP_URL'" >> ./.env.local
 