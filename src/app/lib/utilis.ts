import { AnnoucementProps, ChatMessage, ChatType, ErrandProps, FilterProps, GeoPoint, GoodsCategory, Opinion, SortDirection, User } from "./definitions";

export function dbRowToObject(row: any, object: string) {
  let fromGeoPoint: GeoPoint;
  let toGeoPoint: GeoPoint;
  switch (object) {
    case 'errand':
      fromGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['from_longitude']), Number(row['from_latitude'])],
      };

      toGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['to_longitude']), Number(row['to_latitude'])],
      };

      const errand: ErrandProps = {
        id: row['errand_id'],
        title: row['title'],
        fromCity: row['from_city'],
        toCity: row['to_city'],
        fromGeography: fromGeoPoint,
        toGeography: toGeoPoint,
        earliestAt: new Date(row['earliest_at']),
        latestAt: new Date(row['latest_at']),
        ware: {
          weight: Number(row['ware_weight']),
          size: {
            x: Number(row['ware_size_x']),
            y: Number(row['ware_size_y']),
            height: Number(row['ware_height']),
          },
          name: row['ware_name'],
          category: row['ware_category'],
        },
        authorId: row['author_id'],
        isAccepted: row['is_accepted'],
        desc: row['description'],
        roadColor: row['road_color'],
      };
      return errand;
    case 'annoucement':
      fromGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['from_longitude']), Number(row['from_latitude'])],
      };

      toGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['to_longitude']), Number(row['to_latitude'])],
      };

      const announcement: AnnoucementProps = {
        id: row['announcement_id'],
        title: row['title'],
        fromCity: row['from_city'],
        toCity: row['to_city'],
        fromGeography: fromGeoPoint,
        toGeography: toGeoPoint,
        departureDate: new Date(row['start_date']),
        arrivalDate: new Date(row['arrive_date']),
        carProps: {
          maxWeight: Number(row['max_weight']),
          maxSize: {
            x: Number(row['size_x']),
            y: Number(row['size_y']),
            height: Number(row['max_height']),
          },
          brand: row['vehicle_brand'],
          model: row['vehicle_model'],
        },
        authorId: row['author_id'],
        isAccepted: row['is_accepted'],
        desc: row['description'],
        roadColor: row['road_color'],
      };
      return announcement;
    case 'user':
      const user: User = {
        id: row['user_id'],
        firstname: row['first_name'],
        lastname: row['last_name'],
        email: row['email'],
        createdAt: row['created_at'],
        accountType: row['account_type'],
        companyId: row['company_id'],
        lastSeen: row['last_logged'],
        languages: row['languages'],
        isPhisicalPerson: row['is_psyhical_person'],
        role: row['role'],
        userDesc: row['user_desc'],
        postCount: row['posts_count'],
      };
      return user;
    case 'chat':
      const chat: ChatType = {
        id: row['chat_id'],
        interestedUserId: row['interested_user_id'],
        postAuthorUserId: row['post_author_id'],
        interestedUserName: row['interested_user_name'],
        postAuthorUserName: row['post_author_name'],
        interestedUserLanguages: row['interested_user_languages'],
        postAuthorUserLanguages: row['post_author_languages'],
        title: row['title'],
        announcementId: row['announcement_id'],
        errandId: row['errand_id'],
      };
      return chat;
    case 'message':
      const message: ChatMessage = {
        id: row['message_id'],
        senderId: row['sender_id'],
        content: row['content'],
        sentAt: row['sent_at'],
        readen: row['readen'],
      };
      return message;
    case 'opinion':
      const opinion: Opinion = {
        id: row['opinion_id'],
        stars: row['stars'],
        desc: row['desc'],
        authorId: row['author_id'],
        createdAt: row['created_at'],
        authorFirstName: row['first_name'],
        authorLastName: row['last_name'],
      };
      return opinion;
  }

  return null;
}

export function filterOptionsToSQL(filterOptions: FilterProps, onColumn: string = ''): string {
  const conditions: string[] = [];

  // Dates
  if (filterOptions.date.departureDate.from) {
    conditions.push(`departure_date >= '${filterOptions.date.departureDate.from.toISOString()}'`);
  }
  if (filterOptions.date.departureDate.to) {
    conditions.push(`departure_date <= '${filterOptions.date.departureDate.to.toISOString()}'`);
  }
  if (filterOptions.date.arrivalDate.from) {
    conditions.push(`arrival_date >= '${filterOptions.date.arrivalDate.from.toISOString()}'`);
  }
  if (filterOptions.date.arrivalDate.to) {
    conditions.push(`arrival_date <= '${filterOptions.date.arrivalDate.to.toISOString()}'`);
  }

  // Cities
  if (filterOptions.cities.from) {
    conditions.push(`from_city ILIKE '%${filterOptions.cities.from}%'`);
  }
  if (filterOptions.cities.to) {
    conditions.push(`to_city ILIKE '%${filterOptions.cities.to}%'`);
  }

  // Goods
  if (filterOptions.goods.weight.from !== null) {
    conditions.push(`max_weight >= ${filterOptions.goods.weight.from}`);
  }
  if (filterOptions.goods.weight.to !== null) {
    conditions.push(`max_weight <= ${filterOptions.goods.weight.to}`);
  }

  if (filterOptions.goods.size.x.from !== null) {
    conditions.push(`size_x >= ${filterOptions.goods.size.x.from}`);
  }
  if (filterOptions.goods.size.x.to !== null) {
    conditions.push(`size_x <= ${filterOptions.goods.size.x.to}`);
  }

  if (filterOptions.goods.size.y.from !== null) {
    conditions.push(`size_y >= ${filterOptions.goods.size.y.from}`);
  }
  if (filterOptions.goods.size.y.to !== null) {
    conditions.push(`size_y <= ${filterOptions.goods.size.y.to}`);
  }

  if (filterOptions.goods.size.height.from !== null) {
    conditions.push(`max_height >= ${filterOptions.goods.size.height.from}`);
  }
  if (filterOptions.goods.size.height.to !== null) {
    conditions.push(`max_height <= ${filterOptions.goods.size.height.to}`);
  }

  // Category
  if (filterOptions.goods.category) {
    if (filterOptions.goods.category != GoodsCategory.All)
      conditions.push(`category = '${filterOptions.goods.category}'`);
  }

  if (conditions.length === 0) {
    return '';
  }

  return `WHERE ${onColumn}${conditions.join(' AND ')}`;
}

export function sortDirectionToSQL(sortBy: SortDirection, onColumn: string = '') {
  let by = '';
  switch (sortBy) {
    case SortDirection.ByNewest:
      by = 'created_at ASC';
      break;
    case SortDirection.ByOldest:
      by = 'created_at DESC';
      break;
    case SortDirection.ByWeightAsc:
      by = 'max_weight ASC';
      break;
    case SortDirection.ByWeightDesc:
      by = 'max_weight DESC';
      break;
    case SortDirection.ByHeightAsc:
      by = 'max_height ASC';
      break;
    case SortDirection.ByHeightDesc:
      by = 'max_height DESC';
      break;
    case SortDirection.BySizeAsc:
      by = 'size_x * size_y ASC';
      break;
    case SortDirection.BySizeDesc:
      by = 'size_x * size_y DESC';
      break;
  }
  return `ORDER BY ${onColumn}${by}`;
}