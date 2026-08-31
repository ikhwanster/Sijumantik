import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/auth';
import { 
  HomeInspectionRecord, 
  DengueCaseReport, 
  CommunityReport, 
  LogisticsItem 
} from '../types/jumantik';
import { INITIAL_USERS } from '../data/defaultUsers';
import { 
  INITIAL_INSPECTIONS, 
  INITIAL_CASES, 
  INITIAL_COMMUNITY_REPORTS, 
  INITIAL_LOGISTICS 
} from '../data/initialData';

const USERS_COLL = 'users';
const INSPECTIONS_COLL = 'inspections';
const CASES_COLL = 'cases';
const COMMUNITY_REPORTS_COLL = 'communityReports';
const LOGISTICS_COLL = 'logistics';

// --- USERS SERVICE ---

export const subscribeUsers = (onUpdate: (users: UserProfile[]) => void) => {
  const usersRef = collection(db, USERS_COLL);
  
  return onSnapshot(usersRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed default demo users to Firestore
      console.log('Seeding initial users to Firestore...');
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, USERS_COLL, u.id), u);
      }
      onUpdate(INITIAL_USERS);
    } else {
      const usersList: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data() as UserProfile);
      });
      // Sort newest or by role
      onUpdate(usersList);
    }
  }, (error) => {
    console.error('Error subscribing to users in Firestore:', error);
  });
};

export const saveUserToDb = async (user: UserProfile): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLL, user.id);
    await setDoc(userDocRef, user, { merge: true });
    console.log('User successfully saved to Firestore:', user.id);
  } catch (error) {
    console.error('Failed to save user to Firestore:', error);
    throw error;
  }
};

export const findUserByPhoneOrName = async (phoneOrName: string): Promise<UserProfile | null> => {
  try {
    const usersRef = collection(db, USERS_COLL);
    const snap = await getDocs(usersRef);
    const trimmed = phoneOrName.trim().toLowerCase();
    
    let found: UserProfile | null = null;
    snap.forEach((docSnap) => {
      const u = docSnap.data() as UserProfile;
      if (
        u.phone.trim() === phoneOrName.trim() ||
        u.name.toLowerCase().includes(trimmed) ||
        u.id.toLowerCase() === trimmed
      ) {
        found = u;
      }
    });
    return found;
  } catch (error) {
    console.error('Error querying user from Firestore:', error);
    return null;
  }
};

// --- INSPECTIONS SERVICE ---

export const subscribeInspections = (onUpdate: (inspections: HomeInspectionRecord[]) => void) => {
  const collRef = collection(db, INSPECTIONS_COLL);

  return onSnapshot(collRef, async (snapshot) => {
    if (snapshot.empty) {
      console.log('Seeding initial inspections to Firestore...');
      for (const insp of INITIAL_INSPECTIONS) {
        await setDoc(doc(db, INSPECTIONS_COLL, insp.id), insp);
      }
      onUpdate(INITIAL_INSPECTIONS);
    } else {
      const list: HomeInspectionRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as HomeInspectionRecord);
      });
      // Sort newest date first
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdate(list);
    }
  }, (error) => {
    console.error('Error subscribing to inspections:', error);
  });
};

export const saveInspectionToDb = async (inspection: HomeInspectionRecord): Promise<void> => {
  try {
    const docRef = doc(db, INSPECTIONS_COLL, inspection.id);
    await setDoc(docRef, inspection, { merge: true });
    console.log('Inspection saved to Firestore:', inspection.id);
  } catch (error) {
    console.error('Failed to save inspection:', error);
    throw error;
  }
};

// --- CASES SERVICE ---

export const subscribeCases = (onUpdate: (cases: DengueCaseReport[]) => void) => {
  const collRef = collection(db, CASES_COLL);

  return onSnapshot(collRef, async (snapshot) => {
    if (snapshot.empty) {
      for (const c of INITIAL_CASES) {
        await setDoc(doc(db, CASES_COLL, c.id), c);
      }
      onUpdate(INITIAL_CASES);
    } else {
      const list: DengueCaseReport[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as DengueCaseReport);
      });
      list.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
      onUpdate(list);
    }
  }, (error) => {
    console.error('Error subscribing to cases:', error);
  });
};

export const saveCaseToDb = async (caseReport: DengueCaseReport): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLL, caseReport.id);
    await setDoc(docRef, caseReport, { merge: true });
  } catch (error) {
    console.error('Failed to save case:', error);
    throw error;
  }
};

// --- COMMUNITY REPORTS SERVICE ---

export const subscribeCommunityReports = (onUpdate: (reports: CommunityReport[]) => void) => {
  const collRef = collection(db, COMMUNITY_REPORTS_COLL);

  return onSnapshot(collRef, async (snapshot) => {
    if (snapshot.empty) {
      for (const r of INITIAL_COMMUNITY_REPORTS) {
        await setDoc(doc(db, COMMUNITY_REPORTS_COLL, r.id), r);
      }
      onUpdate(INITIAL_COMMUNITY_REPORTS);
    } else {
      const list: CommunityReport[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as CommunityReport);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    }
  }, (error) => {
    console.error('Error subscribing to community reports:', error);
  });
};

export const saveCommunityReportToDb = async (report: CommunityReport): Promise<void> => {
  try {
    const docRef = doc(db, COMMUNITY_REPORTS_COLL, report.id);
    await setDoc(docRef, report, { merge: true });
  } catch (error) {
    console.error('Failed to save community report:', error);
    throw error;
  }
};

// --- LOGISTICS SERVICE ---

export const subscribeLogistics = (onUpdate: (items: LogisticsItem[]) => void) => {
  const collRef = collection(db, LOGISTICS_COLL);

  return onSnapshot(collRef, async (snapshot) => {
    if (snapshot.empty) {
      for (const item of INITIAL_LOGISTICS) {
        await setDoc(doc(db, LOGISTICS_COLL, item.id), item);
      }
      onUpdate(INITIAL_LOGISTICS);
    } else {
      const list: LogisticsItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as LogisticsItem);
      });
      onUpdate(list);
    }
  }, (error) => {
    console.error('Error subscribing to logistics:', error);
  });
};

export const saveLogisticsToDb = async (item: LogisticsItem): Promise<void> => {
  try {
    const docRef = doc(db, LOGISTICS_COLL, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.error('Failed to save logistics item:', error);
    throw error;
  }
};
