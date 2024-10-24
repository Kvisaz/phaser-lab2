# Achievement Component Improvements

## Problem
Currently, when multiple achievements are triggered in sequence, they overlap each other because each new achievement is positioned without considering existing ones.

## Required Changes

1. Modify Achievements class to track vertical positions:
   - Add a method to calculate next available Y position based on existing floaters
   - Use getBounds() to get accurate heights of existing achievements
   - Consider padding between achievements (e.g. 10px)

2. Update Achievement showAndHide method:
   - Accept Y position parameter in showAndHide
   - Use provided Y position instead of fixed calculation
   - Keep the same animation timing and easing

3. Update show method in Achievements class:
   - Calculate proper Y position before creating new Achievement
   - Pass calculated Y position to showAndHide

## Implementation Details

### Achievements.ts changes:
```typescript
private calculateNextYPosition(): number {
  const { scene } = this.props;
  const canvasSize = getCanvasSize(scene);
  const padding = 10;
  
  // Convert Set to Array for easier sorting
  const activeFloaters = Array.from(this.floaters);
  if (activeFloaters.length === 0) {
    return canvasSize.height - 64; // Default position for first achievement
  }
  
  // Sort by Y position, top to bottom
  activeFloaters.sort((a, b) => a.y - b.y);
  
  // Get topmost achievement
  const topAchievement = activeFloaters[0];
  const { height } = topAchievement.getBounds();
  
  // Position new achievement above the topmost one
  return topAchievement.y - height - padding;
}
```

### Achievement.ts changes:
```typescript
showAndHide(onHide: ()=>void, targetY: number): void {
  const { scene } = this.props;
  const { height } = this.getBounds();

  new Align().anchorSceneScreen(scene)
    .rightIn(this)
    .bottomTo(this);

  scene.add.existing(this);

  scene.tweens.add({
    targets: this,
    y: targetY,
    alpha: 1,
    ease: "Power2", 
    duration: 500
  });
  
  // Rest of the method remains the same
}
```

This solution will:
1. Stack achievements vertically with proper spacing
2. Maintain smooth animations
3. Follow Phaser best practices for positioning and size calculations
4. Keep code modular and maintainable
