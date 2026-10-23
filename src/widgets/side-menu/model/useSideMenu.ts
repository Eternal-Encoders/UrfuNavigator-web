import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { selectPointPresentation } from '@/entities/point';
import { SideBarContent, selectMainContent, setContentNoHistory, setPanelExpanded, selectSettingsOpen, selectCampusOpen,
    selectPanelState, setRestingHeight } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { DrawerOrient, useAppDispatch, useAppSelector, useDrawer } from '@/shared/lib';

const SEARCH_ONLY_HEIGHT = 80;
const BUILDINGS_HEIGHT = 244;
const SWIPE_DISTANCE = 32;
const DIRECTION_THRESHOLD = 6;
const MAP_RESTORE_DELAY = 1500;

const HEAD_IN_DRAWER = [
    SideBarContent.ExpandedInstitutes,
    SideBarContent.TypeList,
    SideBarContent.Categories,
    SideBarContent.PointsList
];

type Gesture = {
    x: number,
    y: number,
    dy: number,
    startHeight: number,
    restingHeight: number,
    mode: 'pending' | 'drawer' | 'native',
    scroller: HTMLElement | null,
    deferredTap: HTMLElement | null
};

export function useSideMenu() {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const mapRestoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mapRestore = useRef<{
        content: SideBarContent, height: number,
        base: { content: SideBarContent, height: number }
    } | null>(null);
    const mapPointers = useRef(new Set<number>());
    const mapTouchActive = useRef(false);
    const content = useAppSelector(selectMainContent);
    const { restoreVersion, restingHeight, routeOpen, routeDocked, routeContent } = useAppSelector(selectPanelState);
    const searchOnlyHeight = routeDocked ? 126 : SEARCH_ONLY_HEIGHT;
    const settingsOpen = useAppSelector(selectSettingsOpen);
    const campusOpen = useAppSelector(selectCampusOpen);
    const focusedRoom = useAppSelector(selectPointPresentation).focus;
    const { innerWidth, innerHeight } = useAppSelector(selectScreenSize);
    const isPhone = innerWidth <= PHONE_BREAKPOINT;
    const isBuildingsDrawer = isPhone && content === SideBarContent.Institutes;
    const routeSearching = routeDocked && [SideBarContent.TypeList, SideBarContent.PointsList].includes(routeContent);
    const isHeadInDrawer = HEAD_IN_DRAWER.includes(content) || routeSearching;
    const [isDragging, setIsDragging] = useState(false);
    const [isSettling, setIsSettling] = useState(false);
    const panelRef = useRef<HTMLElement>(null);
    const gesture = useRef<Gesture | null>(null);
    const suppressClickUntil = useRef(0);
    const baseState = useRef({ content: SideBarContent.Institutes, height: BUILDINGS_HEIGHT });
    const pendingRestingHeight = useRef<number | null>(null);
    const previousContent = useRef(content);

    const expandedHeight = isHeadInDrawer ? innerHeight * 0.9 : BUILDINGS_HEIGHT;
    const previousLayout = useRef({ content, expandedHeight });
    const drawer = useDrawer(
        BUILDINGS_HEIGHT,
        [searchOnlyHeight, expandedHeight, expandedHeight],
        DrawerOrient.Vertical
    );
    const { position } = drawer;
    const positionRef = useRef(position);
    positionRef.current = position;
    const targetRef = useRef(position);
    const animationFrame = useRef(0);
    const hasPainted = useRef(false);
    const isCampus = isPhone && (isBuildingsDrawer || content === SideBarContent.ExpandedInstitutes);
    const campusProgress = isCampus
        ? Math.max(0, Math.min(1,
            (position - BUILDINGS_HEIGHT) / Math.max(1, innerHeight * 0.9 - BUILDINGS_HEIGHT))) : 0;
    const isFullyExpanded = isPhone && (isHeadInDrawer || campusProgress > 0)
        && position > searchOnlyHeight;

    function cancelMapRestore() {
        if (mapRestoreTimer.current !== null) clearTimeout(mapRestoreTimer.current);
        mapRestoreTimer.current = null;
        mapRestore.current = null;
    }

    useEffect(() => {
        cancelMapRestore();
        mapPointers.current.clear();
        mapTouchActive.current = false;
        return cancelMapRestore;
    }, [pathname, isPhone]);

    useEffect(() => {
        if (settingsOpen || campusOpen || routeOpen) cancelMapRestore();
    }, [settingsOpen, campusOpen, routeOpen]);

    function setPositionNow(height: number) {
        positionRef.current = height;
        drawer.setPosTo(height);
    }

    function animateTo(height: number) {
        dispatch(setRestingHeight(height));
        if (animationFrame.current && targetRef.current === height) return;
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = 0;
        targetRef.current = height;
        const from = positionRef.current;
        if (!isPhone || !hasPainted.current || Math.abs(from - height) < 0.5
            || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPositionNow(height);
            setIsSettling(false);
            return;
        }
        setIsSettling(true);
        const started = performance.now();
        const duration = Math.max(from, height) > BUILDINGS_HEIGHT ? 260 : 180;
        function tick(now: number) {
            const time = Math.max(0, Math.min(1, (now - started) / duration));
            const eased = 1 - Math.pow(1 - time, 3);
            setPositionNow(from + (height - from) * eased);
            if (time < 1) animationFrame.current = requestAnimationFrame(tick);
            else {
                animationFrame.current = 0;
                setIsSettling(false);
            }
        }
        animationFrame.current = requestAnimationFrame(tick);
    }

    useEffect(() => {
        hasPainted.current = true;
        return () => cancelAnimationFrame(animationFrame.current);
    }, []);

    useLayoutEffect(() => {
        dispatch(setPanelExpanded(isFullyExpanded));
    }, [dispatch, isFullyExpanded]);

    useLayoutEffect(() => () => {
        dispatch(setPanelExpanded(false));
    }, [dispatch]);

    useLayoutEffect(() => {
        const previous = previousContent.current;
        previousContent.current = content;
        // A content action takes ownership from the active swipe. Its later
        // touchend must not override the new screen's animation/target.
        gesture.current = null;
        setIsDragging(false);
        suppressClickUntil.current = 0;
        if (isHeadInDrawer) {
            if (content === SideBarContent.ExpandedInstitutes) {
                baseState.current = { content: SideBarContent.Institutes, height: BUILDINGS_HEIGHT };
                pendingRestingHeight.current = null;
            } else if (!HEAD_IN_DRAWER.includes(previous) || previous === SideBarContent.ExpandedInstitutes) {
                baseState.current = { content: previous, height: targetRef.current };
            }
            animateTo(expandedHeight);
        } else {
            const height = pendingRestingHeight.current
                ?? BUILDINGS_HEIGHT;
            pendingRestingHeight.current = null;
            baseState.current = { content, height };
            animateTo(height);
        }
    // Content changes own their resting position, independently of keyboard/gesture renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useLayoutEffect(() => {
        const previous = previousLayout.current;
        previousLayout.current = { content, expandedHeight };
        if (previous.content !== content || previous.expandedHeight === expandedHeight) return;
        if (position >= previous.expandedHeight - 1 || position > expandedHeight) animateTo(expandedHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, expandedHeight]);

    useLayoutEffect(() => {
        if (isPhone && routeDocked) animateTo(routeSearching ? innerHeight * 0.9 : searchOnlyHeight);
    // Route editing owns the settled height; keyboard changes must not move the camera/panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPhone, routeDocked, routeSearching]);

    useLayoutEffect(() => {
        if (!restoreVersion || !isPhone) return;
        cancelMapRestore();
        gesture.current = null;
        setIsDragging(false);
        pendingRestingHeight.current = null;
        animateTo(restingHeight);
    // Back restores a settled checkpoint, not a per-frame drawer height.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restoreVersion]);

    useEffect(() => {
        document.documentElement.style.setProperty('--mobile-drawer-offset', isPhone ? `${position + 12}px` : '0px');
        return () => { document.documentElement.style.setProperty('--mobile-drawer-offset', '0px'); };
    }, [isPhone, position]);

    function blurSearch() {
        const active = document.activeElement;
        if (active instanceof HTMLElement && panelRef.current?.contains(active)) active.blur();
    }

    function returnToBase(height = baseState.current.height) {
        blurSearch();
        pendingRestingHeight.current = height;
        dispatch(setContentNoHistory(baseState.current.content));
        animateTo(height);
    }

    function settleBase(height: number) {
        baseState.current = { content, height };
        animateTo(height);
    }

    function toggleDrawer() {
        cancelMapRestore();
        if (isHeadInDrawer) returnToBase();
        else if (isBuildingsDrawer && position >= BUILDINGS_HEIGHT - 1) {
            dispatch(setContentNoHistory(SideBarContent.ExpandedInstitutes));
        } else settleBase(position <= searchOnlyHeight ? BUILDINGS_HEIGHT : searchOnlyHeight);
    }

    useEffect(() => {
        if (!isPhone) return;
        function scheduleRestore() {
            if (mapRestoreTimer.current !== null) clearTimeout(mapRestoreTimer.current);
            mapRestoreTimer.current = null;
            if (!mapRestore.current || mapPointers.current.size || mapTouchActive.current) return;
            mapRestoreTimer.current = setTimeout(() => {
                const saved = mapRestore.current;
                cancelMapRestore();
                if (!saved) return;
                baseState.current = saved.base;
                pendingRestingHeight.current = saved.content === content ? null : saved.height;
                dispatch(setContentNoHistory(saved.content));
                animateTo(saved.height);
            }, MAP_RESTORE_DELAY);
        }
        function collapse(event: Event) {
            if (focusedRoom || routeDocked) return;
            if (!(event.target instanceof Element) || !event.target.closest('[data-map-interaction]')) return;
            // A manually collapsed panel must stay collapsed, even after map input.
            if (!mapRestore.current && targetRef.current <= searchOnlyHeight) return;
            if (!mapRestore.current) mapRestore.current = {
                content, height: targetRef.current, base: { ...baseState.current }
            };
            if (event.type === 'pointerdown') mapPointers.current.add((event as PointerEvent).pointerId);
            if (event.type === 'touchstart') mapTouchActive.current = true;
            gesture.current = null;
            setIsDragging(false);
            if (isHeadInDrawer) returnToBase(searchOnlyHeight);
            else {
                blurSearch();
                settleBase(searchOnlyHeight);
            }
            scheduleRestore();
        }
        function finish(event: Event) {
            if (event instanceof PointerEvent) mapPointers.current.delete(event.pointerId);
            if (event instanceof TouchEvent) mapTouchActive.current = event.touches.length > 0;
            scheduleRestore();
        }
        function panelInteraction(event: Event) {
            if (event.target instanceof Node && panelRef.current?.contains(event.target)) cancelMapRestore();
        }
        const events = ['pointerdown', 'touchstart', 'wheel', 'click', 'keydown'];
        const endEvents = ['pointerup', 'pointercancel', 'touchend', 'touchcancel'];
        events.forEach(type => document.addEventListener(type, collapse, { capture: true, passive: true }));
        endEvents.forEach(type => document.addEventListener(type, finish, { capture: true, passive: true }));
        const panelEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
        panelEvents.forEach(type => document.addEventListener(type, panelInteraction, true));
        return () => {
            events.forEach(type => document.removeEventListener(type, collapse, true));
            endEvents.forEach(type => document.removeEventListener(type, finish, true));
            panelEvents.forEach(type => document.removeEventListener(type, panelInteraction, true));
        };
    });

    useEffect(() => {
        const panel = panelRef.current;
        if (!isPhone || !panel) return;

        function start(event: TouchEvent) {
            if (event.touches.length !== 1 || !(event.target instanceof Element)) return;
            const touch = event.touches[0];
            const bounds = panel!.getBoundingClientRect();
            if (touch.clientY < bounds.top || event.target.closest('.navigator-actions')) return;
            gesture.current = null;
            const target = event.target.closest<HTMLElement>('input, button');
            const deferredTap = event.target.closest('.navigator-search-row')
                && target && document.activeElement !== target ? target : null;
            // Defer search activation until this touch is known to be a tap, not a swipe.
            if (deferredTap) event.preventDefault();
            suppressClickUntil.current = 0;
            cancelAnimationFrame(animationFrame.current);
            animationFrame.current = 0;
            setIsSettling(false);
            gesture.current = {
                x: touch.clientX, y: touch.clientY, dy: 0, startHeight: bounds.height, restingHeight: targetRef.current, mode: 'pending',
                scroller: event.target.closest('.navigator-handle')
                    ? null : event.target.closest<HTMLElement>('.navigator-body'),
                deferredTap
            };
        }

        function move(event: TouchEvent) {
            const current = gesture.current;
            if (!current || event.touches.length !== 1) return;
            const dx = event.touches[0].clientX - current.x;
            const dy = event.touches[0].clientY - current.y;
            current.dy = dy;
            if (current.mode === 'pending') {
                if (Math.max(Math.abs(dx), Math.abs(dy)) < DIRECTION_THRESHOLD) return;
                const scrollable = current.scroller
                    && current.scroller.scrollHeight > current.scroller.clientHeight + 1
                    && getComputedStyle(current.scroller).overflowY === 'auto';
                current.mode = Math.abs(dx) > Math.abs(dy)
                    || (scrollable && (dy < 0 || current.scroller!.scrollTop > 0)) ? 'native' : 'drawer';
                if (current.mode === 'drawer') {
                    setIsDragging(true);
                    blurSearch();
                }
            }
            if (current.mode === 'drawer') {
                event.preventDefault();
                const maximum = isBuildingsDrawer ? innerHeight * 0.9 : expandedHeight;
                setPositionNow(Math.max(searchOnlyHeight, Math.min(current.startHeight - dy, maximum)));
            }
        }

        function end(event: TouchEvent) {
            const current = gesture.current;
            if (!current) return;
            gesture.current = null;
            setIsDragging(false);
            if (current.mode === 'drawer') {
                event.preventDefault();
                suppressClickUntil.current = Date.now() + 1000;
                if (event.type !== 'touchcancel' && Math.abs(current.dy) >= SWIPE_DISTANCE) {
                    if (content === SideBarContent.ExpandedInstitutes && current.dy > 0) {
                        returnToBase(positionRef.current < (searchOnlyHeight + BUILDINGS_HEIGHT) / 2
                            ? searchOnlyHeight : BUILDINGS_HEIGHT);
                    } else if (isHeadInDrawer && current.dy > 0) returnToBase();
                    else if (isHeadInDrawer) animateTo(expandedHeight);
                    else if (isBuildingsDrawer && current.dy < 0 && (current.restingHeight >= BUILDINGS_HEIGHT - 1
                        || positionRef.current > (BUILDINGS_HEIGHT + innerHeight * 0.9) / 2)) {
                        dispatch(setContentNoHistory(SideBarContent.ExpandedInstitutes));
                    } else settleBase(current.dy > 0 ? searchOnlyHeight : BUILDINGS_HEIGHT);
                } else {
                    animateTo(current.restingHeight);
                }
            } else if (current.mode === 'pending' && current.deferredTap && event.type !== 'touchcancel') {
                event.preventDefault();
                suppressClickUntil.current = 0;
                if (current.deferredTap instanceof HTMLInputElement) {
                    current.deferredTap.focus({ preventScroll: true });
                } else {
                    current.deferredTap.click();
                }
            }
        }

        function click(event: MouseEvent) {
            if (Date.now() < suppressClickUntil.current) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        panel.addEventListener('touchstart', start, { capture: true, passive: false });
        panel.addEventListener('touchmove', move, { capture: true, passive: false });
        panel.addEventListener('touchend', end, { capture: true, passive: false });
        panel.addEventListener('touchcancel', end, true);
        panel.addEventListener('click', click, true);
        return () => {
            panel.removeEventListener('touchstart', start, true);
            panel.removeEventListener('touchmove', move, true);
            panel.removeEventListener('touchend', end, true);
            panel.removeEventListener('touchcancel', end, true);
            panel.removeEventListener('click', click, true);
        };
    });

    return {
        content,
        panelRef,
        isDragging,
        isSettling,
        campusProgress,
        isCampus,
        isPhone,
        position,
        panelHeight: isHeadInDrawer && !isDragging && !isSettling && position >= expandedHeight - 1 ? '90%' : position,
        isBuildingsDrawer,
        searchOnlyHeight: searchOnlyHeight,
        toggleDrawer
    };
}
