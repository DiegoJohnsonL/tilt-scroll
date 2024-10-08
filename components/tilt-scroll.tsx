"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { useMediaQuery } from "usehooks-ts";

// Custom hook for device orientation
function useDeviceOrientation() {
  const [beta, setBeta] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setBeta((event.beta || 0) / 5);
    };

    if (isMobile) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  return beta;
}

function Section({
  children,
  color,
  position,
}: {
  children: React.ReactNode;
  color: string;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <Box args={[4, 2, 0.1]} position={[0, 0, -0.05]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text position={[0, 0, 0.1]} fontSize={0.2} maxWidth={3.5} lineHeight={1.5} textAlign="center" color="white">
        {children}
      </Text>
    </group>
  );
}

function Content() {
  const [scrollY, setScrollY] = useState(0);
  const groupRef = useRef<any>();
  const { size } = useThree();
  const beta = useDeviceOrientation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setScrollY((prevScrollY) => {
        const newScrollY = prevScrollY + beta * 0.02;
        return Math.max(0, Math.min(newScrollY, 10)); // Adjusted scrolling range
      });
    }
  }, [beta]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = scrollY;
    }
  });

  // Adjust scale based on device width
  const scale = size.width < 600 ? 0.7 : 1;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <Section color="#ff6b6b" position={[0, 0, 0]}>
        Welcome to our tilt-scrolling adventure! Tilt your device to explore more.
      </Section>
      <Section color="#4ecdc4" position={[0, -3, 0]}>
        Section 2: React Three Fiber combines the power of Three.js with the simplicity of React.
      </Section>
      <Section color="#45b7d1" position={[0, -6, 0]}>
        Section 3: This demo uses device orientation for a unique scrolling experience.
      </Section>
      <Section color="#f9a602" position={[0, -9, 0]}>
        Section 4: Remember, this works best on mobile devices with gyroscope support!
      </Section>
      <Section color="#6c5ce7" position={[0, -12, 0]}>
        Section 5: Thanks for exploring! Tilt back up to revisit previous sections.
      </Section>
    </group>
  );
}

export default function TiltScroll() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    // Ensure the body and html have 100% height
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";

    // Clean up function
    return () => {
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#111"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Content />
      </Canvas>
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            fontSize: "1.2rem",
            maxWidth: "80%",
          }}
        >
          This demo is designed for mobile devices with gyroscope support. Please view on a mobile device for the full
          tilt-scrolling experience.
        </div>
      )}
    </div>
  );
}
