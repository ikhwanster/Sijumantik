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
import { DEFAULT_ADMIN_USER } from '../data/defaultUsers';
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

// Legacy dummy user IDs to clean up
const LEGACY_USER_IDS = ['user-anak-1', 'user-warga-1', 'user-kader-1', 'user-puskesmas-1'];

// --- USERS SERVICE ---

export const subscribeUsers = (onUpdate: (users: UserProfile[]) => void) => {
  const usersRef = collection(db, USERS_COLL);
  
  return onSnapshot(usersRef, async (snapshot) => {
    // Check if any legacy demo users exist and clean them up
    for (const docSnap of snapshot.docs) {
      if (LEGACY_USER_IDS.includes(docSnap.id)) {
        console.log('Cleaning legacy demo user:', docSnap.id);
        await deleteDoc(doc(db, USERS_COLL, docSnap.id)).catch(() => {});
      }
    }

    const usersList: UserProfile[] = [];
    snapshot.forEach((docSnap) => {
      if (!LEGACY_USER_IDS.includes(docSnap.id)) {
        usersList.push(docSnap.data() as UserProfile);
      }
    });

    // If no users at all, add default admin user
    if (usersList.length === 0) {
      console.log('Seeding default admin user to Firestore...');
      await setDoc(doc(db, USERS_COLL, DEFAULT_ADMIN_USER.id), DEFAULT_ADMIN_USER).catch(() => {});
      usersList.push(DEFAULT_ADMIN_USER);
    }

    onUpdate(usersList);
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

export const deleteUserFromDb = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLL, userId);
    await deleteDoc(userDocRef);
    console.log('User successfully deleted from Firestore:', userId);
  } catch (error) {
    console.error('Failed to delete user from Firestore:', error);
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
        (u.phone && u.phone.trim() === phoneOrName.trim()) ||
        (u.email && u.email.trim().toLowerCase() === trimmed) ||
        (u.name && u.name.toLowerCase().includes(trimmed)) ||
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

export const findUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const usersRef = collection(db, USERS_COLL);
    const snap = await getDocs(usersRef);
    const trimmed = email.trim().toLowerCase();
    
    let found: UserProfile | null = null;
    snap.forEach((docSnap) => {
      const u = docSnap.data() as UserProfile;
      if (u.email && u.email.trim().toLowerCase() === trimmed) {
        found = u;
      }
    });
    return found;
  } catch (error) {
    console.error('Error querying user by email from Firestore:', error);
    return null;
  }
};

export const clearAllUsersAndInspectionsInDb = async (): Promise<void> => {
  try {
    // Delete all users except default admin
    const usersSnap = await getDocs(collection(db, USERS_COLL));
    for (const docSnap of usersSnap.docs) {
      await deleteDoc(doc(db, USERS_COLL, docSnap.id));
    }
    // Delete all inspections
    const inspSnap = await getDocs(collection(db, INSPECTIONS_COLL));
    for (const docSnap of inspSnap.docs) {
      await deleteDoc(doc(db, INSPECTIONS_COLL, docSnap.id));
    }
    // Delete all community reports
    const repSnap = await getDocs(collection(db, COMMUNITY_REPORTS_COLL));
    for (const docSnap of repSnap.docs) {
      await deleteDoc(doc(db, COMMUNITY_REPORTS_COLL, docSnap.id));
    }
    // Re-seed default admin
    await setDoc(doc(db, USERS_COLL, DEFAULT_ADMIN_USER.id), DEFAULT_ADMIN_USER);
    console.log('Database refreshed and reset with Admin user.');
  } catch (error) {
    console.error('Error clearing data from Firestore:', error);
  }
};

// --- INSPECTIONS SERVICE ---

export const subscribeInspections = (onUpdate: (inspections: HomeInspectionRecord[]) => void) => {
  const collRef = collection(db, INSPECTIONS_COLL);

  return onSnapshot(collRef, (snapshot) => {
    const list: HomeInspectionRecord[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as HomeInspectionRecord);
    });
    // Sort newest date first
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    onUpdate(list);
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

export const deleteInspectionFromDb = async (inspectionId: string): Promise<void> => {
  try {
    const docRef = doc(db, INSPECTIONS_COLL, inspectionId);
    await deleteDoc(docRef);
    console.log('Inspection deleted from Firestore:', inspectionId);
  } catch (error) {
    console.error('Failed to delete inspection:', error);
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

export const deleteCaseFromDb = async (caseId: string): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLL, caseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete case:', error);
    throw error;
  }
};

// --- COMMUNITY REPORTS SERVICE ---

export const subscribeCommunityReports = (onUpdate: (reports: CommunityReport[]) => void) => {
  const collRef = collection(db, COMMUNITY_REPORTS_COLL);

  return onSnapshot(collRef, (snapshot) => {
    const list: CommunityReport[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CommunityReport);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
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

export const deleteCommunityReportFromDb = async (reportId: string): Promise<void> => {
  try {
    const docRef = doc(db, COMMUNITY_REPORTS_COLL, reportId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete community report:', error);
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

export const deleteLogisticsFromDb = async (itemId: string): Promise<void> => {
  try {
    const docRef = doc(db, LOGISTICS_COLL, itemId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete logistics item:', error);
    throw error;
  }
};

