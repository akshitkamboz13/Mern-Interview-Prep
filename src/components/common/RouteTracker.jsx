import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { useSyllabus } from '../../context/SyllabusContext';

const RouteTracker = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { startUpMode, loading } = useSyllabus();
    const [isRestored, setIsRestored] = React.useState(false);

    // Initial Restoration
    useEffect(() => {
        if (loading) return; // Wait for context loading to finish (including startUpMode)

        const restoreLocation = async () => {
            // Only restore if we are at root '/' (fresh load mostly)
            // AND user wants to restore
            if (location.pathname === '/' && startUpMode === 'last' && !isRestored) {
                try {
                    const lastPath = await localforage.getItem('lastLocation');
                    if (lastPath && lastPath !== '/') {
                        console.log('Restoring last location:', lastPath);
                        navigate(lastPath, { replace: true });
                    }
                } catch (err) {
                    console.error('Failed to restore location', err);
                }
            }
            setIsRestored(true);
        };

        // Slight delay to ensure router is ready
        // But actually useEffect runs after mount so it's fine.
        // We check !isRestored to prevent loop if we navigate back to /
        if (!isRestored) {
            restoreLocation();
        }

    }, [loading, startUpMode, isRestored, navigate, location.pathname]);


    // Tracking
    useEffect(() => {
        if (!isRestored) return; // Verify restoration is complete before tracking

        localforage.setItem('lastLocation', location.pathname).catch(err => console.error('Failed to save loc', err));
    }, [location, isRestored]);

    return null;
};

export default RouteTracker;
