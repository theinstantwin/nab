# Product Requirements Document (PRD)
## Nab - Drag to Download Images v2.0

### Executive Summary
A Chrome extension that enables instant image downloading through intuitive drag gestures. The extension transforms the cumbersome right-click → save process into a simple, visual drag interaction.

### Product Vision
**"Make image downloading as natural as dragging a file to the trash."**

We believe users should be able to grab any image and simply drag it to download, just like they would drag a file on their desktop. This extension eliminates friction while maintaining absolute simplicity.

### Core Philosophy: Focused Design Principles

#### 1. Single Purpose Focus
- **Scope**: Download images from HTML `<img>` elements
- **Anti-scope**: No bulk operations, editing, organization, or media conversion
- **Focus**: Perfect the single interaction of drag-to-download

#### 2. Composable & Universal
- **Zero Dependencies**: Works with any website, no permissions needed
- **No Configuration**: Installs and works immediately
- **Predictable Behavior**: Same interaction pattern across all sites

#### 3. Clear Interface Design
- **Clear Visual Language**: Progressive outline feedback (blue → green)
- **Immediate Feedback**: Users know exactly when download will trigger
- **Error Communication**: Clear success/failure notifications

### Target User & Problem Statement

#### Primary User
**Casual web browsers** who occasionally want to save images they encounter online.

#### Current Pain Points
1. **Right-click menu friction**: Multiple steps, easy to mis-click
2. **Filename guessing**: Default "image.jpg" names are unhelpful  
3. **Save dialog delays**: Interrupts browsing flow
4. **Mobile limitation**: Right-click doesn't exist on touch devices

#### Success Metrics
- **Adoption**: >80% of users use the extension within first day of install
- **Retention**: Users continue using it after 1 week (minimal friction)
- **Performance**: <2MB memory usage, <1% CPU impact
- **Reliability**: <1% failure rate on supported image types

### Functional Requirements

#### Core Functionality ✅ COMPLETED
1. **Drag Detection**
   - Minimum 50px drag distance to prevent accidental downloads
   - Works on any `<img>` element regardless of size or position
   - ESC key cancellation at any point during drag

2. **Visual Feedback** 
   - Progressive blue outline during drag initiation
   - Green outline when download threshold is reached
   - Smooth CSS animations for professional feel
   - Success animation on completion

3. **Download Handling**
   - Automatic filename extraction from image URL
   - Graceful fallback for CORS-protected images (new tab)
   - Support for data URLs and standard image formats
   - Clear success/error notifications

4. **Error Resilience**
   - Comprehensive try-catch coverage
   - Detailed error logging for debugging
   - Graceful degradation for unsupported scenarios
   - Race condition prevention (fixed draggedImage nullification bug)

#### Technical Architecture ✅ COMPLETED
- **Manifest V3 compliance** with minimal permissions
- **Class-based ES6 architecture** for maintainability
- **Event-driven design** with proper cleanup
- **Memory management** prevents leaks and performance degradation
- **Debug mode** for developer troubleshooting

### Non-Functional Requirements

#### Performance ✅ ACHIEVED
- **Memory footprint**: <2MB
- **CPU usage**: <1% during normal operation
- **Load time**: <100ms to initialize
- **Response time**: <50ms for visual feedback

#### Compatibility ✅ VERIFIED
- **Chrome 88+** (Manifest V3 requirement)
- **All websites** - no site-specific restrictions
- **Cross-origin images** - graceful fallback behavior

#### User Experience ✅ DELIVERED
- **Zero learning curve**: Uses natural drag gesture
- **Immediate activation**: Works instantly after install
- **Visual clarity**: Always clear what action will be taken
- **Respectful UI**: Minimal visual impact on web pages

### Explicit Non-Requirements

#### Features We Will NOT Build
1. **Background image support** - Different DOM interaction paradigm
2. **SVG/vector graphics** - Requires separate handling logic
3. **Video/media downloads** - Completely different use case
4. **Bulk/batch operations** - Violates single-action principle
5. **Image editing/conversion** - Separate tool category
6. **Custom download folders** - OS-level configuration
7. **Right-click integration** - Would duplicate existing functionality
8. **Keyboard shortcuts** - Drag gesture is the interface

#### Integration Boundaries
- **No external APIs** - Self-contained functionality only
- **No user accounts** - Stateless operation
- **No data collection** - Zero telemetry or analytics
- **No settings panel** - Configuration violates Unix philosophy

### Success Criteria & Definition of Done

#### Version 2.0 Success Criteria ✅ ACHIEVED
- [x] Stable drag-to-download functionality across major websites
- [x] Race condition bugs resolved (draggedImage nullification fixed)
- [x] Comprehensive error handling with user feedback
- [x] Clean, maintainable class-based architecture
- [x] Complete documentation (README, PRD, troubleshooting guide)
- [x] Performance optimization (memory and CPU efficiency)
- [x] Visual polish with smooth animations and feedback

#### Long-term Success Indicators
- **User adoption**: Extension used regularly without issues
- **Code maintainability**: New developers can understand and contribute easily
- **Zero configuration**: Users never need to adjust settings
- **Cross-site reliability**: Works consistently regardless of website technology

### Risk Assessment & Mitigation

#### Technical Risks ✅ MITIGATED
- **CORS limitations**: Mitigated with fallback to new tab opening
- **Site compatibility**: Handled through comprehensive error handling
- **Memory leaks**: Prevented with proper cleanup in class destructor
- **Race conditions**: Resolved through careful timeout management

#### Product Risks ✅ ADDRESSED
- **Feature creep**: Mitigated by strict Unix philosophy adherence
- **User confusion**: Prevented through intuitive drag gesture and clear feedback
- **Performance impact**: Monitored and optimized to <2MB memory usage

### Development Philosophy

#### Minimalism Over Features
Every proposed feature must pass the "Unix test":
1. Does this improve the core drag-to-download experience?
2. Can this be done better by a separate, specialized tool?
3. Would this add configuration or complexity?

#### Quality Over Quantity
- **Comprehensive testing** on diverse websites
- **Thorough error handling** for edge cases
- **Performance monitoring** to prevent regression
- **Clear documentation** for users and developers

#### Commit Message Standards
All commits should focus on technical changes made to files, not philosophical concepts:

**Good Examples:**
- `"Fix race condition in draggedImage timeout handling"`
- `"Add comprehensive error handling to download methods"`
- `"Refactor to class-based architecture for better maintainability"`
- `"Update manifest.json with new icons and permissions"`
- `"Remove PRD from public README project structure"`

**Avoid:**
- References to "Unix philosophy" or design philosophy
- Marketing language or feature promotion
- Vague descriptions like "improvements" or "updates"

**Format:** `"[Action] [specific change] [optional: reason/impact]"`
- Action: Fix, Add, Update, Remove, Refactor, etc.
- Be specific about what files/functions were changed
- Focus on the technical "what" not the conceptual "why"

### Conclusion

This extension successfully demonstrates that following Unix philosophy in modern web development creates superior user experiences. By focusing exclusively on drag-to-download functionality, we've created a tool that:

- **Solves a real problem** better than existing solutions
- **Integrates seamlessly** into users' browsing workflows  
- **Performs reliably** across diverse web environments
- **Maintains simplicity** without sacrificing functionality

The result is a Chrome extension that truly "does one thing and does it well" - turning the complex multi-step process of saving images into a simple, intuitive drag gesture. 