import Errand from '../ui/posts/errand';
import {
  Address,
  AnnouncementProps,
  ChatMessage,
  ChatType,
  Company,
  ErrandProps,
  FilterProps,
  GeoPoint,
  GoodsCategory,
  Opinion,
  RowMapping,
  SortDirection,
  User,
} from './definitions';
import bcrypt from 'bcrypt';

export function dbRowToObject(row: any, object: RowMapping) {
  let fromGeoPoint: GeoPoint;
  let toGeoPoint: GeoPoint;
  switch (object) {
    case RowMapping.ErrandProps:
      fromGeoPoint = {
        coordinates: [row['from_longitude'], row['from_latitude']],
      };

      toGeoPoint = {
        coordinates: [row['to_longitude'], row['to_latitude']],
      };

      const errand: ErrandProps = {
        id: row['errand_id'],
        title: row['title'],
        from: {
          countryId: row['from_country_id'],
          stateId: row['from_state_id'],
          cityId: row['from_city_id'],
          city: row['from_city'],
          countryIso2: row['from_country_iso2'],
          geography: fromGeoPoint,
        },
        to: {
          countryId: row['to_country_id'],
          stateId: row['to_state_id'],
          cityId: row['to_city_id'],
          city: row['to_city'],
          countryIso2: row['to_country_iso2'],
          geography: toGeoPoint,
        },
        earliestAt: new Date(row['earliest_at']),
        latestAt: new Date(row['latest_at']),
        ware: {
          weight: Number(row['weight']),
          size: {
            x: Number(row['size_x']),
            y: Number(row['size_y']),
            height: Number(row['height']),
          },
          name: row['good_name'],
          category: row['good_category'],
        },
        authorId: row['author_id'],
        isAccepted: row['is_accepted'],
        desc: row['description'],
        roadColor: row['road_color'],
      };
      return errand;
    case RowMapping.AnnoucementProps:
      fromGeoPoint = {
        coordinates: [row['from_longitude'], row['from_latitude']],
      };

      toGeoPoint = {
        coordinates: [row['to_longitude'], row['to_latitude']],
      };

      const announcement: AnnouncementProps = {
        id: row['announcement_id'],
        title: row['title'],
        from: {
          countryId: row['from_country_id'],
          stateId: row['from_state_id'],
          cityId: row['from_city_id'],
          city: row['from_city'],
          countryIso2: row['from_country_iso2'],
          geography: fromGeoPoint,
        },
        to: {
          countryId: row['to_country_id'],
          stateId: row['to_state_id'],
          cityId: row['to_city_id'],
          city: row['to_city'],
          countryIso2: row['to_country_iso2'],
          geography: toGeoPoint,
        },
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
    case RowMapping.User:
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
        isPhisicalPerson: row['is_phisical_person'],
        role: row['role'],
        userDesc: row['user_desc'],
        postCount: row['posts_count'],
      };
      return user;
    case RowMapping.ChatType:
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
    case RowMapping.ChatMessage:
      const message: ChatMessage = {
        id: row['message_id'],
        senderId: row['sender_id'],
        content: row['content'],
        sentAt: row['sent_at'],
        readen: row['readen'],
      };
      return message;
    case RowMapping.Opinion:
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
    case RowMapping.Company:
      const company: Company = {
        id: row['company_id'],
        companyName: row['name'],
        taxId: row['taxid'],
        address: {
          countryId: row['country_id'],
          stateId: row['state_id'],
          cityId: row['city_id'],
          city: row['city'],
          postalCode: row['postal_code'],
          street: row['street'],
          countryIso2: row['country_iso2'],
          geography: {
            coordinates: [row['latitude'], row['longitude']],
          },
        },
      };
      return company;
    case RowMapping.Address:
      fromGeoPoint = {
        coordinates: [row['from_longitude'], row['from_latitude']],
      };

      toGeoPoint = {
        coordinates: [row['to_longitude'], row['to_latitude']],
      };
      const address: Address = {
        countryId: row['country_id'],
        stateId: row['state_id'],
        cityId: row['city_id'],
        city: row['city_name'],
        postalCode: row['postal_code'],
        street: row['street'],
        countryName: row['country_name'],
        countryIso2: row['country_iso2'],
        geography: { coordinates: [row['longitude'], row['latitude']] },
      };
      return address;
  }
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

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371;

  const lat1 = (parseFloat(point1.coordinates[0]) * Math.PI) / 180;
  const lon1 = (parseFloat(point1.coordinates[1]) * Math.PI) / 180;
  const lat2 = (parseFloat(point2.coordinates[0]) * Math.PI) / 180;
  const lon2 = (parseFloat(point2.coordinates[1]) * Math.PI) / 180;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(2));
}

export function arePointsInRange(point1: GeoPoint, point2: GeoPoint, maxDistance: number): boolean {
  return calculateDistance(point1, point2) <= maxDistance;
}

export function areDimensionsValid(ware: ErrandProps['ware'], carProps: AnnouncementProps['carProps']): boolean {
  return (
    ware.weight <= carProps.maxWeight &&
    ware.size.height <= carProps.maxSize.height &&
    ware.size.x * ware.size.y <= carProps.maxSize.x * carProps.maxSize.y
  );
}

export function isMatchingDelivery(
  fromPoint1: GeoPoint,
  fromPoint2: GeoPoint,
  toPoint1: GeoPoint,
  toPoint2: GeoPoint,
  ware: ErrandProps['ware'],
  carProps: AnnouncementProps['carProps']
): boolean {
  const isStartPointValid = arePointsInRange(fromPoint1, fromPoint2, 50);
  const isEndPointValid = arePointsInRange(toPoint1, toPoint2, 50);
  const areSizesValid = areDimensionsValid(ware, carProps);

  return isStartPointValid && isEndPointValid && areSizesValid;
}